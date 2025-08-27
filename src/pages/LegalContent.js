import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLegalContent,
  updateLegalContent,
  clearLegalErrors,
} from "../store/slices/legalSlice";
import { addNotification } from "../store/slices/uiSlice";
import { FileText, Shield, Cookie, Check, X, Eye, Building2 } from "lucide-react";
import RichTextEditor from "../components/RichTextEditor";
import ContentPreview from "../components/ContentPreview";

const LegalContent = () => {
  const dispatch = useDispatch();
  const {
    privacyPolicy,
    termsOfService,
    cookiePolicy,
    aboutUs,
    globalLoading,
    globalError,
  } = useSelector((state) => state.legal);

  const [activeTab, setActiveTab] = useState("privacyPolicy");
  const [editing, setEditing] = useState(false);
  const [tempContent, setTempContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    dispatch(fetchLegalContent());
  }, [dispatch]);

  useEffect(() => {
    if (globalError) {
      dispatch(
        addNotification({
          type: "error",
          title: "Error",
          message: globalError,
        })
      );
      dispatch(clearLegalErrors());
    }
  }, [globalError, dispatch]);

  const handleEdit = (type) => {
    setActiveTab(type);
    setTempContent(getContentByType(type));
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      await dispatch(
        updateLegalContent({ type: activeTab, content: tempContent })
      ).unwrap();

      dispatch(
        addNotification({
          type: "success",
          title: "Success",
          message: `${getTabTitle(activeTab)} updated successfully!`,
        })
      );

      setEditing(false);
    } catch (error) {
      // Error is handled by the slice
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setTempContent("");
  };

  const getContentByType = (type) => {
    switch (type) {
      case "privacyPolicy":
        return privacyPolicy.content;
      case "termsOfService":
        return termsOfService.content;
      case "cookiePolicy":
        return cookiePolicy.content;
      case "aboutUs":
        return aboutUs.content;
      default:
        return "";
    }
  };

  const getTabTitle = (type) => {
    switch (type) {
      case "privacyPolicy":
        return "Privacy Policy";
      case "termsOfService":
        return "Terms of Service";
      case "cookiePolicy":
        return "Cookie Policy";
      case "aboutUs":
        return "About Us";
      default:
        return "";
    }
  };

  const getLastUpdated = (type) => {
    const content = getContentByType(type);
    if (!content) return "Not set";

    const lastUpdated =
      type === "privacyPolicy"
        ? privacyPolicy.lastUpdated
        : type === "termsOfService"
        ? termsOfService.lastUpdated
        : type === "cookiePolicy"
        ? cookiePolicy.lastUpdated
        : aboutUs.lastUpdated;

    return lastUpdated
      ? new Date(lastUpdated).toLocaleDateString()
      : "Recently updated";
  };

  const tabs = [
    {
      id: "privacyPolicy",
      name: "Privacy Policy",
      icon: Shield,
      description: "Manage your website's privacy policy content",
    },
    {
      id: "termsOfService",
      name: "Terms of Service",
      icon: FileText,
      description: "Manage your website's terms of service content",
    },
    {
      id: "cookiePolicy",
      name: "Cookie Policy",
      icon: Cookie,
      description: "Manage your website's cookie policy content",
    },
    {
      id: "aboutUs",
      name: "About Us",
      icon: Building2,
      description: "Manage your company's about us content",
    },
  ];

  if (globalLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Legal Content Management
        </h1>
        <p className="text-gray-600">
          Manage your website's legal documents and company information including privacy policy, terms
          of service, cookie policy, and about us content.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <tab.icon className="w-5 h-5 inline mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {getTabTitle(activeTab)}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Last updated: {getLastUpdated(activeTab)}
              </p>
            </div>
            <div className="flex space-x-3">
              {!editing && (
                <>
                  <button
                    onClick={() => setShowPreview(true)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </button>
                  <button
                    onClick={() => handleEdit(activeTab)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Edit Content
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          {editing ? (
            <div className="space-y-4">
              <RichTextEditor
                value={tempContent}
                onChange={setTempContent}
                placeholder={`Enter your ${getTabTitle(
                  activeTab
                ).toLowerCase()} content here...`}
                rows={20}
              />

              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  disabled={getContentByType(activeTab) === tempContent}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="prose max-w-none">
              {getContentByType(activeTab) ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: getContentByType(activeTab),
                  }}
                  className="text-gray-700 leading-relaxed"
                />
              ) : (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No content
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by adding content to your{" "}
                    {getTabTitle(activeTab).toLowerCase()}.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => handleEdit(activeTab)}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Add Content
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-3">
          Tips for Legal Content
        </h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>
            • Keep your legal documents clear, concise, and easy to understand
          </li>
          <li>
            • Update content regularly to reflect changes in your business
            practices
          </li>
          <li>• Consider having a legal professional review your content</li>
          <li>• Use HTML formatting to make content more readable</li>
          <li>• Include contact information for legal inquiries</li>
        </ul>
      </div>

      {/* Content Preview Modal */}
      <ContentPreview
        content={getContentByType(activeTab)}
        title={getTabTitle(activeTab)}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </div>
  );
};

export default LegalContent;
